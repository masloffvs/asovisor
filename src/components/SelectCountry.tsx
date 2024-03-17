import _ from "lodash";
import { countries, getCountryData, TCountryCode } from "countries-list";
import { className } from "postcss-selector-parser";

interface Props {
  readonly userActuallySelectLang?: boolean;
  readonly country?: string | undefined;
  readonly setCountry?: (it: string | undefined) => void;
  readonly setLang?: (it: string | undefined) => void;
  readonly className?: string;
}

export default function SelectCountry({
  country,
  className,
  userActuallySelectLang,
  setLang,
  setCountry,
}: Props) {
  return (
    <select
      className={className}
      value={country}
      onChange={(e) => {
        if (setCountry) {
          setCountry(e.target.value);
        }
        const langForCountry =
          _.first(getCountryData(e.target.value as TCountryCode).languages) ||
          undefined;

        if (!userActuallySelectLang && langForCountry) {
          if (setLang) {
            setLang(langForCountry);
          }
        }
      }}
    >
      {_.toPairs(countries).map((i) => (
        <option value={i[0]} key={i[0]}>
          {i[1].name}
        </option>
      ))}
    </select>
  );
}
