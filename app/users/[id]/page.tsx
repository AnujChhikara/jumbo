'use client';

import { UsersApi } from '@/api/users/users.api';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Building, Mail, MapPin, Phone, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UsersApi.getUserById.fn(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto p-6'>
        <div className='mb-8'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Users
          </button>
        </div>

        <div className='bg-card border border-border rounded-lg shadow-sm p-6'>
          <div className='flex items-start gap-6 mb-8'>
            <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center'>
              <span className='text-2xl font-bold text-primary'>
                {user?.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </span>
            </div>
            <div className='flex-1'>
              <h2 className='text-2xl font-semibold text-foreground mb-2'>
                {user.name}
              </h2>
              <p className='text-muted-foreground'>@{user.username}</p>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>
                Contact Information
              </h3>

              <div className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Email</p>
                  <p className='text-foreground'>{user.email}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Phone className='w-5 h-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Phone</p>
                  <p className='text-foreground'>{user.phone}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Building className='w-5 h-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Company</p>
                  <p className='text-foreground'>{user.company.name}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <User className='w-5 h-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Website</p>
                  <a
                    href={`https://${user.website}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>
                Address
              </h3>

              <div className='flex items-start gap-3'>
                <MapPin className='w-5 h-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='text-sm text-muted-foreground'>Full Address</p>
                  <p className='text-foreground'>
                    {user.address.street}, {user.address.suite}
                  </p>
                  <p className='text-foreground'>
                    {user.address.city}, {user.address.zipcode}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <MapPin className='w-5 h-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Coordinates</p>
                  <p className='text-foreground'>
                    {user.address.geo.lat}, {user.address.geo.lng}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8 pt-6 border-t border-border'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              Company Details
            </h3>
            <div className='grid md:grid-cols-3 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Catch Phrase</p>
                <p className='text-foreground'>{user.company.catchPhrase}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Business Strategy
                </p>
                <p className='text-foreground'>{user.company.bs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
