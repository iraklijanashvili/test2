import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/layout/SEO';
import type { Tutorial } from '@shared/schema';
import { tutorialService } from '@/services/supabaseService';

const tutorialSchema = z.object({
  title: z.string().min(1, 'სათაური სავალდებულოა'),
  content: z.string().min(1, 'შინაარსი სავალდებულოა'),
  category: z.string().min(1, 'კატეგორია სავალდებულოა'),
  imageUrl: z.string().optional(),
  readTime: z.string().min(1, 'წაკითხვის დრო სავალდებულოა')
});

type TutorialFormData = z.infer<typeof tutorialSchema>;

export default function TutorialManager() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const tutorialId = location.split('/').pop();
  const isEditing = tutorialId !== 'new';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TutorialFormData>({
    resolver: zodResolver(tutorialSchema)
  });

  const { data: tutorial, isLoading } = useQuery<Tutorial>({
    queryKey: [`/iraklijanashvili/tutorials/${tutorialId}`],
    enabled: isEditing,
    queryFn: async () => {
      if (tutorialId && tutorialId !== 'new') {
        return await tutorialService.getById(parseInt(tutorialId));
      }
      throw new Error('არასწორი ID');
    }
  });

  useState(() => {
    if (tutorial) {
      setValue('title', tutorial.title);
      setValue('content', tutorial.content);
      setValue('category', tutorial.category);
      setValue('imageUrl', tutorial.imageUrl || '');
      setValue('readTime', tutorial.readTime);
    }
  }, [tutorial]);

  const onSubmit = async (data: TutorialFormData) => {
    try {
      // Supabase-ის გამოყენება მონაცემების შესანახად
      if (isEditing && tutorialId) {
        await tutorialService.update(parseInt(tutorialId), {
          title: data.title,
          content: data.content,
          category: data.category,
          image_url: data.imageUrl || null,
          read_time: data.readTime
        });
        toast({
          title: 'ინსტრუქცია განახლდა',
          description: 'ოპერაცია წარმატებით შესრულდა'
        });
      } else {
        await tutorialService.create({
          title: data.title,
          content: data.content,
          category: data.category,
          image_url: data.imageUrl || null,
          read_time: data.readTime
        });
        toast({
          title: 'ინსტრუქცია დაემატა',
          description: 'ოპერაცია წარმატებით შესრულდა'
        });
      }
      setLocation('/iraklijanashvili');
    } catch (error) {
      console.error('ინსტრუქციის შენახვის შეცდომა:', error);
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
        title={`${isEditing ? 'ინსტრუქციის რედაქტირება' : 'ახალი ინსტრუქცია'} | უნივერსალური ხელსაწყოები`}
        description="ინსტრუქციების მართვის პანელი"
        ogType="website"
        keywords="ინსტრუქციები, მართვა, ადმინისტრირება"
      />
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? 'ინსტრუქციის რედაქტირება' : 'ახალი ინსტრუქცია'}
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

            <div>
              <Input
                placeholder="სურათის URL (არასავალდებულო)"
                {...register('imageUrl')}
              />
            </div>

            <div>
              <Input
                placeholder="წაკითხვის დრო (მაგ: 5 წუთი)"
                {...register('readTime')}
                className={errors.readTime ? 'border-red-500' : ''}
              />
              {errors.readTime && (
                <p className="text-red-500 text-sm mt-1">{errors.readTime.message}</p>
              )}
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