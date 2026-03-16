import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth); // ← est-il connecté ?

  return user           // ← si user existe dans Redux
    ? children          // ← affiche la page demandée
    : <Navigate to="/login" /> // ← sinon redirige vers login
};

export default ProtectedRoute;