import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignInData } from '@/types/auth';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onClose: () => void;
}

export function SignInForm({ onSwitchToSignUp, onClose }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual sign in logic
      console.log('Sign in data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'github') => {
    // TODO: Implement social login
    console.log(`Sign in with ${provider}`);
  };

  return (
    <div className="space-y-4">
      {/* Social Login Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-black text-white hover:bg-gray-800"
          onClick={() => handleSocialLogin('google')}
        >
          G
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-black text-white hover:bg-gray-800"
          onClick={() => handleSocialLogin('facebook')}
        >
          f
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-black text-white hover:bg-gray-800"
          onClick={() => handleSocialLogin('github')}
        >
          🐙
        </Button>
      </div>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Continue'}
        </Button>
      </form>

      {/* Switch to Sign Up */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-black font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
} 