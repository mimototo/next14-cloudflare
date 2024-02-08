'use server';

import { authGuard } from '@/app/actions/auth';
import { db } from '@/lib/prisma';
import { deleteImage, putImage } from '@/lib/storage';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const PostSchema = z.object({
  body: z.string().max(140),
});

export const createPost = async (formData: FormData) => {
  const authorId = authGuard();
  const id = randomUUID();

  // TODO 一旦これで
  const title = "title"
  const validatedData = PostSchema.parse({
    body: formData.get('body'),
  });
  const newData: Prisma.PostUncheckedCreateInput = {
    ...validatedData,
    id,
    authorId,
    title
  };

  const thumbnailDataURL = formData.get('thumbnail') as File;

  if (thumbnailDataURL) {
    newData.thumbnailURL = await putImage(
      thumbnailDataURL,
      `posts/${id}/thumbnail.png`
    );
  }

  await db.post.create({
    data: newData,
  });

  revalidatePath('/');
  redirect('/');
};

export const updatePost = async (id: string, formData: FormData) => {
  const authorId = authGuard();
  const validatedData = PostSchema.parse({
    body: formData.get('body'),
  });
  const newData: Prisma.PostUncheckedUpdateInput = {
    body: validatedData.body,
  };

  const thumbnailDataURL = formData.get('thumbnail') as File;
  const thumbnailAction = formData.get('thumbnail-action') as string;
  const imagePath = `posts/${id}/thumbnail.png`;

  if (thumbnailDataURL && thumbnailAction === 'save') {
    newData.thumbnailURL = await putImage(thumbnailDataURL, imagePath);
  } else if (thumbnailAction === 'delete') {
    newData.thumbnailURL = null;
    await deleteImage(imagePath);
  }

  await db.post.update({
    where: {
      id,
      authorId,
    },
    data: newData,
  });

  revalidatePath('/');
};

export const deletePost = async (id: string, imageURL?: string | null) => {
  const uid = authGuard();

  await db.post.delete({
    where: {
      id,
      authorId: uid,
    },
  });

  if (imageURL) {
    deleteImage(imageURL.replace(process.env.IMAGE_HOST_URL as string, ''));
  }

  revalidatePath('/');
  redirect('/');
};

export const getOwnPost = (editId: string) => {
  const uid = authGuard();

  return db.post.findUnique({
    where: {
      id: editId,
      authorId: uid,
    },
  });
}
