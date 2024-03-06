-- CreateEnum
CREATE TYPE "MixinType" AS ENUM ('TEXT', 'MEDIA', 'LINK');

-- CreateEnum
CREATE TYPE "MixinConcatType" AS ENUM ('PAGINATION', 'SEARCH', 'TAGS');

-- CreateEnum
CREATE TYPE "MixinStatus" AS ENUM ('PUBLISHED', 'HIDDEN');

-- AlterEnum
ALTER TYPE "PostStatus" ADD VALUE 'PUBLISHED';

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "mediaId" TEXT;

-- CreateTable
CREATE TABLE "Mixins" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "text" TEXT,
    "linkUrl" TEXT,
    "linkText" VARCHAR(50),
    "postId" TEXT,
    "type" "MixinType" NOT NULL DEFAULT 'TEXT',
    "concatTypes" "MixinConcatType"[],
    "status" "MixinStatus" NOT NULL DEFAULT 'HIDDEN',
    "orderPercentage" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mixins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixinsSettings" (
    "id" TEXT NOT NULL,
    "concatType" "MixinConcatType" NOT NULL,
    "amountPerPage" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MixinsSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mixins_id_key" ON "Mixins"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MixinsSettings_id_key" ON "MixinsSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MixinsSettings_concatType_key" ON "MixinsSettings"("concatType");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mixins" ADD CONSTRAINT "Mixins_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mixins" ADD CONSTRAINT "Mixins_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
