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
    enabled: isEditing
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
      const response = await fetch(`/iraklijanashvili/tutorials${isEditing ? `/${tutorialId}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: isEditing ? 'ინსტრუქცია განახლდა' : 'ინსტრუქცია დაემატა',
          description: 'ოპერაცია წარმატებით შესრულდა'
        });
        setLocation('/iraklijanashvili');
      } else {
        throw new Error('ოპერაცია ვერ შესრულდა');
      }
    } catch (error) {
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