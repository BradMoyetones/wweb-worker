export function formatDate(dateString: string | null): string {
    if(!dateString) return ""
    const isoString = dateString.replace(" ", "T");
    const date = isoString.includes(isoString) 
        ? new Date(isoString) // Maneja formato con 'T'
        : new Date(`${isoString}T00:00:00`); // Forzar formato con hora para 'YYYY-MM-DD'

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
}

export function getTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const filterData = (query: string, data: any[]) => {
  const keywords = query.toLowerCase().split(" ").filter(Boolean); // Divide la consulta en palabras clave

  return data.filter((framework) =>
    keywords.every((keyword) =>
      framework.title.toLowerCase().includes(keyword)
    )
  );
};