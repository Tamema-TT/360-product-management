import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.string("description").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.integer("parent_category_id").unsigned().nullable();
    table.foreign("parent_category_id").references("categories.id").onDelete('CASCADE');
    table.timestamps(true, true);
  });

  await knex.schema.createTable("attributes", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("attribute_values", (table) => {
    table.increments("id").primary();
    table.string("value").notNullable();
    table.integer("attribute_id").unsigned();
    table.foreign("attribute_id").references("attributes.id").onDelete('CASCADE');
    table.timestamps(true, true);
  });

  await knex.schema.createTable("product_categories", (table) => {
    table.integer("product_id").unsigned();
    table.integer("category_id").unsigned();
    table.foreign("product_id").references("products.id").onDelete('CASCADE');
    table.foreign("category_id").references("categories.id").onDelete('CASCADE');
    table.primary(["product_id", "category_id"]);
  });

  await knex.schema.createTable("product_attributes", (table) => {
    table.integer("product_id").unsigned();
    table.integer("attribute_id").unsigned();
    table.integer("attribute_value_id").unsigned();
    table.foreign("product_id").references("products.id").onDelete('CASCADE');
    table.foreign("attribute_id").references("attributes.id").onDelete('CASCADE');
    table.foreign("attribute_value_id").references("attribute_values.id").onDelete('CASCADE');
    table.primary(["product_id", "attribute_id"]);
  });

  await knex.raw(`
    CREATE TRIGGER category_deactivate AFTER UPDATE ON categories
    FOR EACH ROW
    BEGIN
      IF NOT NEW.is_active AND OLD.is_active THEN
        UPDATE products SET is_active = 0 WHERE id IN (
          SELECT DISTINCT product_id FROM product_categories WHERE category_id = OLD.id
        );
      END IF;
    END;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("product_attributes");
  await knex.schema.dropTableIfExists("product_categories");
  await knex.schema.dropTableIfExists("attribute_values");
  await knex.schema.dropTableIfExists("attributes");
  await knex.schema.dropTableIfExists("categories");
  await knex.schema.dropTableIfExists("products");

  // drop the trigger if exists
  await knex.raw(`
    DROP TRIGGER IF EXISTS category_deactivate;
  `);
}
