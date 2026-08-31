begin;

-- =========================================================
-- categories -> catalog_items
-- =========================================================

do $$
declare
  fk record;
begin
  for fk in
    select c.conname
    from pg_constraint c
    join pg_class child_table
      on child_table.oid = c.conrelid
    join pg_namespace child_schema
      on child_schema.oid = child_table.relnamespace
    join pg_class parent_table
      on parent_table.oid = c.confrelid
    join pg_namespace parent_schema
      on parent_schema.oid = parent_table.relnamespace
    where c.contype = 'f'
      and child_schema.nspname = 'public'
      and child_table.relname = 'catalog_items'
      and parent_schema.nspname = 'public'
      and parent_table.relname = 'categories'
      and array(
        select a.attname::text
        from unnest(c.conkey)
          with ordinality as cols(attnum, ord)
        join pg_attribute a
          on a.attrelid = c.conrelid
         and a.attnum = cols.attnum
        order by cols.ord
      ) = array['category_id']::text[]
  loop
    execute format(
      'alter table public.catalog_items drop constraint %I',
      fk.conname
    );
  end loop;
end $$;

alter table public.catalog_items
  add constraint catalog_items_category_id_fkey
  foreign key (category_id)
  references public.categories(id)
  on delete cascade;


-- =========================================================
-- catalog_items -> catalog_item_images
-- =========================================================

do $$
declare
  fk record;
begin
  for fk in
    select c.conname
    from pg_constraint c
    join pg_class child_table
      on child_table.oid = c.conrelid
    join pg_namespace child_schema
      on child_schema.oid = child_table.relnamespace
    join pg_class parent_table
      on parent_table.oid = c.confrelid
    join pg_namespace parent_schema
      on parent_schema.oid = parent_table.relnamespace
    where c.contype = 'f'
      and child_schema.nspname = 'public'
      and child_table.relname = 'catalog_item_images'
      and parent_schema.nspname = 'public'
      and parent_table.relname = 'catalog_items'
      and array(
        select a.attname::text
        from unnest(c.conkey)
          with ordinality as cols(attnum, ord)
        join pg_attribute a
          on a.attrelid = c.conrelid
         and a.attnum = cols.attnum
        order by cols.ord
      ) = array['catalog_item_id']::text[]
  loop
    execute format(
      'alter table public.catalog_item_images drop constraint %I',
      fk.conname
    );
  end loop;
end $$;

alter table public.catalog_item_images
  add constraint catalog_item_images_catalog_item_id_fkey
  foreign key (catalog_item_id)
  references public.catalog_items(id)
  on delete cascade;

commit;
