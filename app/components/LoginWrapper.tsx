"use client";

import { LoginForm } from 'anjrot-components';
import { useActionState } from 'react';
import { authenticate } from '../helpers/actions';
import { useSearchParams } from 'next/navigation';

const LoginWrapper = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'; 
    const [errorMesage, formAction, ispPending] = useActionState(authenticate, undefined); // Assuming you have a custom hook for action state management
    return <LoginForm action={formAction} error={errorMesage} callbackurl={callbackUrl} />;
};

export default LoginWrapper;