/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    create table "movie" as
      select "titleBasics".*,
        "averageRating",
        "numVotes",
        "russian"."title" as "russianTitle",
        "english"."title" as "englishTitle",
        to_tsvector('simple', "russian"."title" || ' ' || "english"."title" || ' ' ||
        "titleBasics"."startYear"::text) as "tsvectorTitle"
    from "titleBasics"
      inner join "titleRatings"
        on "titleBasics"."tconst" = "titleRatings".tconst
      inner join (select "titleId", "title", row_number() over (partition by "titleId", "region", "types") as "rowNum"
        from "titleAkas"
        where "region" = 'RU'
          and "types" = 'imdbDisplay') as "russian"
      on "russian"."titleId" = "titleBasics"."tconst" and "russian"."rowNum" = 1
      inner join (select "titleId", "title", row_number() over (partition by "titleId", "region", "types") as "rowNum"
        from "titleAkas"
        where "region" = 'US'
          and "types" = 'imdbDisplay') as "english"
      on "english"."titleId" = "titleBasics"."tconst" and "english"."rowNum" = 1
    where "titleBasics"."titleType" = 'movie'
      and "titleRatings"."numVotes" > 10000;

    alter table "movie"
      add "published" date unique;    

    create index on "movie" using gin ("tsvectorTitle");
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
    drop table "movie";
  `);
};
