'use client';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import { useMemo, useState } from 'react';
import { User } from '../api/users/users.types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAddUser: () => void;
}

export const UserTable = ({
  users,
  onEdit,
  onDelete,
  onAddUser,
}: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [emailSortOrder, setEmailSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(users.map(user => user.company.name))];
    return uniqueCompanies.sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCompany =
        selectedCompany === 'all' || user.company.name === selectedCompany;
      return matchesSearch && matchesCompany;
    });
  }, [users, searchTerm, selectedCompany]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const comparison = a.email.localeCompare(b.email);
      return emailSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredUsers, emailSortOrder]);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEmailSort = () => {
    setEmailSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    resetPagination();
  };

  return (
    <div className='min-w-7xl space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
          <input
            type='text'
            placeholder='Search by name...'
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
          />
        </div>

        <Select.Root
          value={selectedCompany}
          onValueChange={handleCompanyChange}
        >
          <Select.Trigger className='flex items-center text-sm justify-between w-full sm:w-48 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer hover:bg-accent'>
            <Select.Value placeholder='Filter by company' />
            <Select.Icon>
              <ChevronDownIcon className='w-4 h-4 text-muted-foreground' />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className='overflow-hidden bg-popover rounded-md border border-border shadow-lg'
              position='popper'
              sideOffset={4}
              align='start'
            >
              <Select.Viewport className='p-1'>
                <Select.Item
                  value='all'
                  className='relative flex items-center px-8 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer focus:outline-none focus:bg-accent focus:text-accent-foreground'
                >
                  <Select.ItemText>All Companies</Select.ItemText>
                </Select.Item>
                {companies.map(company => (
                  <Select.Item
                    key={company}
                    value={company}
                    className='relative flex items-center px-8 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer focus:outline-none focus:bg-accent focus:text-accent-foreground'
                  >
                    <Select.ItemText>{company}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <button
          onClick={onAddUser}
          className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
        >
          Add User
        </button>
      </div>

      <div className='border border-border rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-muted/50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-medium text-muted-foreground'>
                  Avatar
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium text-muted-foreground'>
                  Name
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium text-muted-foreground'>
                  <button
                    onClick={handleEmailSort}
                    className='flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring rounded'
                  >
                    Email
                    {emailSortOrder === 'asc' ? (
                      <ChevronUpIcon className='w-4 h-4' />
                    ) : (
                      <ChevronDownIcon className='w-4 h-4' />
                    )}
                  </button>
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium text-muted-foreground'>
                  Phone
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium text-muted-foreground'>
                  Company
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium text-muted-foreground'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {paginatedUsers.map(user => (
                <tr
                  key={user.id}
                  className='hover:bg-muted/30 transition-colors'
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium'>
                      {getInitials(user.name)}
                    </div>
                  </td>
                  <td className='px-4 py-3 text-sm text-foreground font-medium'>
                    {user.name}
                  </td>
                  <td className='px-4 py-3 text-sm text-foreground'>
                    {user.email}
                  </td>
                  <td className='px-4 py-3 text-sm text-foreground'>
                    {user.phone}
                  </td>
                  <td className='px-4 py-3 text-sm text-foreground'>
                    {user.company.name}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => onEdit(user)}
                        className='p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring'
                        title='Edit user'
                      >
                        <Pencil1Icon className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className='p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring'
                        title='Delete user'
                      >
                        <TrashIcon className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedUsers.length === 0 && (
          <div className='px-4 py-8 text-center text-muted-foreground'>
            {searchTerm || selectedCompany !== 'all'
              ? 'No users match your filters.'
              : 'No users found.'}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex items-center gap-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-ring'
            >
              <ChevronLeftIcon className='w-4 h-4' />
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='flex items-center gap-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-ring'
            >
              Next
              <ChevronRightIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
