import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/layout/SEO';
import type { Tip } from '@shared/schema';
import { tipService } from '@/services/supabaseService';

const tipSchema = z.object({
  title: z.string().min(1, 'სათაური სავალდებულოა'),
  content: z.string().min(1, 'შინაარსი სავალდებულოა'),
  category: z.string().min(1, 'კატეგორია სავალდებულოა'),
  isTipOfDay: z.boolean().default(false)
});

type TipFormData = z.infer<typeof tipSchema>;

export default function TipManager() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const tipId = location.split('/').pop();
  const isEditing = tipId !== 'new';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TipFormData>({
    resolver: zodResolver(tipSchema)
  });

  const { data: tip, isLoading } = useQuery<Tip>({
    queryKey: [`/iraklijanashvili/tips/${tipId}`],
    enabled: isEditing,
    queryFn: async () => {
      if (tipId && tipId !== 'new') {
        return await tipService.getById(parseInt(tipId));
      }
      throw new Error('არასწორი ID');
    }
  });

  useState(() => {
    if (tip) {
      setValue('title', tip.title);
      setValue('content', tip.content);
      setValue('category', tip.category);
      setValue('isTipOfDay', tip.isTipOfDay === 1);
    }
  }, [tip]);

  const onSubmit = async (data: TipFormData) => {
    try {
      // Supabase-ის გამოყენება მონაცემების შესანახად
      if (isEditing && tipId) {
        await tipService.update(parseInt(tipId), {
          title: data.title,
          content: data.content,
          category: data.category,
          is_tip_of_day: data.isTipOfDay
        });
        toast({
          title: 'რჩევა განახლდა',
          description: 'ოპერაცია წარმატებით შესრულდა'
        });
      } else {
        await tipService.create({
          title: data.title,
          content: data.content,
          category: data.category,
          is_tip_of_day: data.isTipOfDay
        });
        toast({
          title: 'რჩევა დაემატა',
          description: 'ოპერაცია წარმატებით შესრულდა'
        });
      }
      setLocation('/iraklijanashvili');
    } catch (error) {
      console.error('რჩევის შენახვის შეცდომა:', error);
      toast({
        title: 'შეცდომა',
        description: 'ოპერაცია ვერ შესრულდა',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">იტვირთება...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={`${isEditing ? 'რჩევის რედაქტირება' : 'ახალი რჩევა'} | უნივერსალური ხელსაწყოები`}
        description="რჩევების მართვის პანელი"
        ogType="website"
        keywords="რჩევები, მართვა, ადმინისტრირება"
      />
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? 'რჩევის რედაქტირება' : 'ახალი რჩევა'}
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="სათაური"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Textarea
                placeholder="შინაარსი"
                {...register('content')}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="კატეგორია"
                {...register('category')}
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register('isTipOfDay')} />
              <label>დღის რჩევა</label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/iraklijanashvili')}
              >
                გაუქმება
              </Button>
              <Button type="submit">
                {isEditing ? 'განახლება' : 'დამატება'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}