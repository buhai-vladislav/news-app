/*
  Warnings:

  - You are about to drop the column `updated` on the `Token` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('RICH_TEXT', 'MEDIA');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('HIDDEN', 'DRAFT');

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "updated",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "RssSource" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "isStopped" BOOLEAN NOT NULL DEFAULT false,
    "interval" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "RssSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RssFieldsConnections" (
    "id" TEXT NOT NULL,
    "internal" VARCHAR(50) NOT NULL,
    "external" VARCHAR(50) NOT NULL,
    "rssSourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RssFieldsConnections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "creatorId" TEXT,
    "creatorName" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsToPosts" (
    "tagId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "TagsToPosts_pkey" PRIMARY KEY ("tagId","postId")
);

-- CreateTable
CREATE TABLE "PostsBlocks" (
    "id" TEXT NOT NULL,
    "order" SMALLINT NOT NULL,
    "type" "FieldType" NOT NULL DEFAULT 'RICH_TEXT',
    "content" TEXT,
    "postId" TEXT NOT NULL,
    "mediaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostsBlocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RssSource_id_key" ON "RssSource"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RssFieldsConnections_id_key" ON "RssFieldsConnections"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_id_key" ON "Tags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Posts_id_key" ON "Posts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Posts_externalId_key" ON "Posts"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "PostsBlocks_id_key" ON "PostsBlocks"("id");

-- AddForeignKey
ALTER TABLE "RssSource" ADD CONSTRAINT "RssSource_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RssFieldsConnections" ADD CONSTRAINT "RssFieldsConnections_rssSourceId_fkey" FOREIGN KEY ("rssSourceId") REFERENCES "RssSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsToPosts" ADD CONSTRAINT "TagsToPosts_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsToPosts" ADD CONSTRAINT "TagsToPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsBlocks" ADD CONSTRAINT "PostsBlocks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsBlocks" ADD CONSTRAINT "PostsBlocks_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
