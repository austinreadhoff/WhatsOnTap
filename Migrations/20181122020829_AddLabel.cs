using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WhatsOnTap.Migrations
{
    public partial class AddLabel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long?>(
                name: "labelId",
                table: "Beer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "labelId",
                table: "Beer");
        }
    }
}
