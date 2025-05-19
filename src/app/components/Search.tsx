export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  categories
}: any) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Pesquisar cupons..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">Todos</option>
          <option value="Available">Disponíveis</option>
          <option value="Redeemed">Resgatados</option>
        </select>
      </div>
    </div>
  </div>
)
