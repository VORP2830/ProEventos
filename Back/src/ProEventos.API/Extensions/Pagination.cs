using System.Text.Json;
using ProEventos.API.models;

namespace ProEventos.API.Extensions
{
    public static class Pagination
    {
        public static void AddPagination (this HttpResponse response, int currentPage, 
                                    int itemsPerPages, int totalItems, int totalPages)
        {
            var pagination = new PaginationHeader(currentPage, itemsPerPages, totalItems, totalPages);
            
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(pagination, options));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}