import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const signUp = async (req: Request, res: Response) => {
  const { email, password, role = 'client' } = req.body;

  try {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    if (!user) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    const { error: profileError } = await supabase
      .from('users')
      .insert([{ id: user.id, email, role }]);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!session) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    res.json({
      token: session.access_token,
      user: session.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};