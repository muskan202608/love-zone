import { Router } from "express";
import { db } from "@workspace/db";
import { seoPagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateSeoPageBody,
  UpdateSeoPageBody,
  GetSeoPageParams,
  UpdateSeoPageParams,
  DeleteSeoPageParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/seo-pages", async (_req, res): Promise<void> => {
  const pages = await db.select().from(seoPagesTable).orderBy(seoPagesTable.createdAt);
  res.json(
    pages.map((p) => ({
      ...p,
      faq: p.faq ?? null,
      createdAt: p.createdAt?.toISOString() ?? null,
      updatedAt: p.updatedAt?.toISOString() ?? null,
    }))
  );
});

router.post("/seo-pages", async (req, res): Promise<void> => {
  const parsed = CreateSeoPageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [page] = await db.insert(seoPagesTable).values(parsed.data).returning();
  res.status(201).json({
    ...page,
    faq: page.faq ?? null,
    createdAt: page.createdAt?.toISOString() ?? null,
    updatedAt: page.updatedAt?.toISOString() ?? null,
  });
});

router.get("/seo-pages/:slug", async (req, res): Promise<void> => {
  const params = GetSeoPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [page] = await db
    .select()
    .from(seoPagesTable)
    .where(eq(seoPagesTable.slug, params.data.slug));

  if (!page || !page.isActive) {
    res.status(404).json({ error: "SEO page not found" });
    return;
  }

  res.json({
    ...page,
    faq: page.faq ?? null,
    createdAt: page.createdAt?.toISOString() ?? null,
    updatedAt: page.updatedAt?.toISOString() ?? null,
  });
});

router.patch("/seo-pages/:slug", async (req, res): Promise<void> => {
  const params = UpdateSeoPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSeoPageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [page] = await db
    .update(seoPagesTable)
    .set(parsed.data)
    .where(eq(seoPagesTable.slug, params.data.slug))
    .returning();

  if (!page) {
    res.status(404).json({ error: "SEO page not found" });
    return;
  }

  res.json({
    ...page,
    faq: page.faq ?? null,
    createdAt: page.createdAt?.toISOString() ?? null,
    updatedAt: page.updatedAt?.toISOString() ?? null,
  });
});

router.delete("/seo-pages/:slug", async (req, res): Promise<void> => {
  const params = DeleteSeoPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(seoPagesTable).where(eq(seoPagesTable.slug, params.data.slug));
  res.sendStatus(204);
});

export default router;
