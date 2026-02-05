import { Expression, sql } from "kysely";

/**
 * Reusable Kysely helper functions following documentation best practices.
 * These demonstrate how to create composable, type-safe query helpers.
 */

/**
 * Convert a string expression to uppercase.
 */
export function upper(expr: Expression<string>) {
  return sql<string>`upper(${expr})`;
}

/**
 * Convert a string expression to lowercase.
 */
export function lower(expr: Expression<string>) {
  return sql<string>`lower(${expr})`;
}

/**
 * Concatenate multiple string expressions.
 */
export function concat(...exprs: Expression<string>[]) {
  return sql.join<string>(exprs, sql` || `);
}

/**
 * Check if a column value is in a list.
 * Type-safe wrapper around IN operator.
 */
export function isIn<T>(column: Expression<T>, values: T[]) {
  return sql<boolean>`${column} IN (${sql.join(values.map((v) => sql`${v}`))})`
}

/**
 * Create a COALESCE expression for handling null values.
 */
export function coalesce<T>(
  expr: Expression<T | null>,
  defaultValue: Expression<T>,
) {
  return sql<T>`COALESCE(${expr}, ${defaultValue})`;
}

/**
 * Create a CASE WHEN expression for conditional logic.
 */
export function caseWhen<T>(
  condition: Expression<boolean>,
  thenValue: Expression<T>,
  elseValue: Expression<T>,
) {
  return sql<T>`CASE WHEN ${condition} THEN ${thenValue} ELSE ${elseValue} END`;
}

/**
 * Calculate age from a birthdate column.
 * PostgreSQL-specific example.
 */
export function age(birthdateColumn: Expression<Date>) {
  return sql<number>`EXTRACT(YEAR FROM AGE(${birthdateColumn}))`;
}

/**
 * Full-text search helper for PostgreSQL.
 * Uses tsvector and tsquery for text search.
 */
export function fullTextSearch(
  column: Expression<string>,
  searchTerm: string,
) {
  return sql<boolean>`to_tsvector('english', ${column}) @@ to_tsquery('english', ${searchTerm})`;
}

/**
 * JSON contains operator for PostgreSQL.
 * Checks if a JSON column contains a specific value.
 */
export function jsonContains<T>(
  jsonColumn: Expression<T>,
  value: Partial<T>,
) {
  return sql<boolean>`${jsonColumn} @> ${JSON.stringify(value)}::jsonb`;
}

/**
 * Date range check helper.
 */
export function dateBetween(
  dateColumn: Expression<Date>,
  start: Date | string,
  end: Date | string,
) {
  return sql<boolean>`${dateColumn} BETWEEN ${start} AND ${end}`;
}

/**
 * Generate a UUID (PostgreSQL).
 */
export function generateUuid() {
  return sql<string>`gen_random_uuid()`;
}

/**
 * Current timestamp helper.
 */
export function now() {
  return sql<Date>`NOW()`;
}
