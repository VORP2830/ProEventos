namespace ProEventos.API.models
{
    public class PaginationHeader
    {
        public PaginationHeader(int currentPage, int itemsPerPages, int totalItems, int totalCount)
        {
            this.CurrentPage = currentPage;
            this.itemsPerPages = itemsPerPages;
            this.totalItems = totalItems;
            this.TotalCount = totalCount;

        }
        public int CurrentPage { get; set; }
        public int itemsPerPages { get; set; }
        public int totalItems { get; set; }
        public int TotalCount { get; set; }
    }
}