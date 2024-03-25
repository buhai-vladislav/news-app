-- DropForeignKey
ALTER TABLE "PostsBlocks" DROP CONSTRAINT "PostsBlocks_postId_fkey";

-- AddForeignKey
ALTER TABLE "PostsBlocks" ADD CONSTRAINT "PostsBlocks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
