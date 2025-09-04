-- DropForeignKey
ALTER TABLE "public"."collaborators" DROP CONSTRAINT "collaborators_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."collaborators" DROP CONSTRAINT "collaborators_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."collaborators" ADD CONSTRAINT "collaborators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."collaborators" ADD CONSTRAINT "collaborators_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
