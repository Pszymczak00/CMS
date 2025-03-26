using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class ChangeOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_CateringTypes_CateringTypeId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CateringTypeId",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "CateringTypeId",
                table: "Orders",
                newName: "Price");

            migrationBuilder.AddColumn<string>(
                name: "CateringName",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CateringName",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Orders",
                newName: "CateringTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CateringTypeId",
                table: "Orders",
                column: "CateringTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_CateringTypes_CateringTypeId",
                table: "Orders",
                column: "CateringTypeId",
                principalTable: "CateringTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
