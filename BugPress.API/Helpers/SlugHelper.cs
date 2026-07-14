using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace BugPress.API.Helpers
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string phrase)
        {
            if (string.IsNullOrWhiteSpace(phrase))
                return string.Empty;

            // Converter para minúsculas
            string str = phrase.ToLowerInvariant();

            // Normalizar (remover acentos)
            str = RemoveDiacritics(str);

            // Remover caracteres inválidos (manter apenas letras, números, espaços e hifens)
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");

            // Converter múltiplos espaços em um único espaço
            str = Regex.Replace(str, @"\s+", " ").Trim();

            // Cortar se passar do limite de tamanho razoável para SEO (ex: 150 caracteres)
            if (str.Length > 150)
            {
                str = str.Substring(0, 150).Trim();
            }

            // Substituir espaços por hífen
            str = Regex.Replace(str, @"\s", "-");

            return str;
        }

        private static string RemoveDiacritics(string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
