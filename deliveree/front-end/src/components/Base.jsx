import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Base() {
  return <Navigate replace to="/login" />;
}
