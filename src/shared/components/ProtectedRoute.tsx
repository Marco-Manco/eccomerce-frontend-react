import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store';

interface Props {
  children: ReactNode;
  role?: string;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { token, user } = useAppSelector((s) => s.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.rol !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
