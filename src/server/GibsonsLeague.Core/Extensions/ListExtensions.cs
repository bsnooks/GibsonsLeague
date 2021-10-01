using System;
using System.Collections.Generic;

namespace GibsonsLeague.Core
{
    public static class ListExtensions
    {
        public static IEnumerable<List<T>> SplitList<T>(this List<T> items, int batch = 30)
        {
            for (int i = 0; i < items.Count; i += batch)
            {
                yield return items.GetRange(i, Math.Min(batch, items.Count - i));
            }
        }
    }
}
