using Microsoft.EntityFrameworkCore.Migrations;

namespace WhatsOnTap.Migrations
{
    public partial class NullableBeerColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE Beer RENAME TO temp;

                CREATE TABLE Beer (
                    id INTEGER NOT NULL CONSTRAINT 'PK_Beer' PRIMARY KEY AUTOINCREMENT,
                    name TEXT NULL,
                    styleId INTEGER NULL,
                    abv REAL NULL,
                    ibu REAL NULL,
                    og REAL NULL,
                    fg REAL NULL,
                    srm REAL NULL,
                    description TEXT NULL,
                    labelId INTEGER NULL
                );

                INSERT INTO Beer
                SELECT *
                FROM temp;

                DROP TABLE temp;
            ");
            // migrationBuilder.AlterColumn<long>(
            //     name: "styleId",
            //     table: "Beer",
            //     nullable: true,
            //     oldClrType: typeof(long));

            // migrationBuilder.AlterColumn<double>(
            //     name: "srm",
            //     table: "Beer",
            //     nullable: true,
            //     oldClrType: typeof(double));

            // migrationBuilder.AlterColumn<double>(
            //     name: "og",
            //     table: "Beer",
            //     nullable: true,
            //     oldClrType: typeof(double));

            // migrationBuilder.AlterColumn<double>(
            //     name: "ibu",
            //     table: "Beer",
            //     nullable: true,
            //     oldClrType: typeof(double));

            // migrationBuilder.AlterColumn<double>(
            //     name: "fg",
            //     table: "Beer",
            //     nullable: true,
            //     oldClrType: typeof(double));

            // migrationBuilder.AlterColumn<double>(
            //     name: "abv",
            //     table: "Beer",
            //     nullable: true,
            //     oldClrType: typeof(double));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE Beer RENAME TO temp;

                CREATE TABLE Beer (
                    id INTEGER NOT NULL CONSTRAINT 'PK_Beer' PRIMARY KEY AUTOINCREMENT,
                    name TEXT NULL,
                    styleId INTEGER NULL,
                    abv REAL NOT NULL,
                    ibu REAL NOT NULL,
                    og REAL NOT NULL,
                    fg REAL NOT NULL,
                    srm REAL NOT NULL,
                    description TEXT NULL,
                    labelId INTEGER NULL
                );

                INSERT INTO Beer
                SELECT *
                FROM temp;

                DROP TABLE temp;
            ");
            // migrationBuilder.AlterColumn<long>(
            //     name: "styleId",
            //     table: "Beer",
            //     nullable: false,
            //     oldClrType: typeof(long),
            //     oldNullable: true);

            // migrationBuilder.AlterColumn<double>(
            //     name: "srm",
            //     table: "Beer",
            //     nullable: false,
            //     oldClrType: typeof(double),
            //     oldNullable: true);

            // migrationBuilder.AlterColumn<double>(
            //     name: "og",
            //     table: "Beer",
            //     nullable: false,
            //     oldClrType: typeof(double),
            //     oldNullable: true);

            // migrationBuilder.AlterColumn<double>(
            //     name: "ibu",
            //     table: "Beer",
            //     nullable: false,
            //     oldClrType: typeof(double),
            //     oldNullable: true);

            // migrationBuilder.AlterColumn<double>(
            //     name: "fg",
            //     table: "Beer",
            //     nullable: false,
            //     oldClrType: typeof(double),
            //     oldNullable: true);

            // migrationBuilder.AlterColumn<double>(
            //     name: "abv",
            //     table: "Beer",
            //     nullable: false,
            //     oldClrType: typeof(double),
            //     oldNullable: true);
        }
    }
}
