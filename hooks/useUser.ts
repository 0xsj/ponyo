// hooks/useUser.ts
import { useState, useEffect } from 'react';
import { UserAPI } from '@/lib/supabase/api/user';
import { User } from '@/lib/models';
import { APIResult } from '@/lib/shared/result';
import { APIError } from '@/lib/errors/api-error';

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]); // Changed to handle a list of users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const api = new UserAPI();
        const result: APIResult<User[]> = await api.getAll();

        result.match({
          ok: (users) => {
            setUsers(users); 
            setError(null);
          },
          fail: (error: APIError) => {
            setError(error.message);
            setUsers([]);
          }
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); 

  return { users, loading, error };
};