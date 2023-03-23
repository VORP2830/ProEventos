using System;
using Microsoft.EntityFrameworkCore;
using ProEventos.API.Data;

var builder = WebApplication.CreateBuilder(args);

string mySqlConnection = builder.Configuration.GetConnectionString("DefaultConnection");
// Add services to Entity Framework
builder.Services.AddDbContext<DataContext>(options =>
                options.UseMySql(mySqlConnection,
                ServerVersion.AutoDetect(mySqlConnection)));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.UseCors(x => x.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin());

app.MapControllers();

app.Run();
