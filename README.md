# "New Dark Ages" Date Converter / Конвертер дат "Нові Темні Віки"

Bidirectional date converter between Earth Gregorian calendar and the Martian calendar from Max Kidruk's "Нові Темні Віки" (New Dark Ages) book series.

Двосторонній конвертер дат між земним григоріанським календарем та марсіанським календарем із серії книг Макса Кідрука «Нові Темні Віки».

## Features / Можливості

- Earth → Mars and Mars → Earth date conversion
- Bilingual interface (Ukrainian / English)
- Dark / light theme with system preference detection
- Reference table of all 12 Martian zodiac months
- Zero dependencies — pure HTML, CSS, and JavaScript
- Works offline — all calculations run client-side

## Live Site / Сайт

🔗 ["New Dark Ages" Date Converter](https://iamartko.github.io/ntv-date-converter/)

## How It Works

The converter implements the orbital mechanics algorithm from the [Jussieu Mars Climate Database](https://www-mars.lmd.jussieu.fr/mars/time/martian_time.html), adapted for the calendar system defined in the book series. It uses Kepler's equation to compute Mars solar longitude (Ls) and maps sols to the 12 Martian zodiac months.

## Credits / Подяки

- **Calendar system**: [Max Kidruk](https://darkages.maxkidruk.com/) — "Нові Темні Віки" (New Dark Ages) book series
- **Conversion algorithm**: [Jussieu Mars Climate Database](https://www-mars.lmd.jussieu.fr/mars/time/martian_time.html) — Mars time converter

## License / Ліцензія

[MIT](LICENSE)
