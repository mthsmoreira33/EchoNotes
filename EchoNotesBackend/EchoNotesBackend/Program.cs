using EchoNotesBackend.Data;
using EchoNotesBackend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<INoteService, NoteService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .WithMethods("GET", "POST", "PUT", "DELETE")
                   .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    var httpPort = int.Parse(Environment.GetEnvironmentVariable("ASPNETCORE_HTTP_PORTS") ?? "80");
    serverOptions.ListenAnyIP(httpPort);

    // var httpsPortString = Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORTS");
    // if (!string.IsNullOrEmpty(httpsPortString))
    // {
    //     var httpsPort = int.Parse(httpsPortString);
    //     serverOptions.ListenAnyIP(httpsPort, listenOptions =>
    //     {
    //         listenOptions.UseHttps();
    //     });
    // }
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
