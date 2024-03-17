import { AppDto } from "@/dto/AppDto";
import Link from "next/link";

interface Props {
  readonly appDetails?: AppDto;
}

export default function CompactAppCard(props: Props) {
  return (
    <Link href={props.appDetails?.url || "/"} target="_blank">
      <div className="cursor-pointer">
        <img
          className="h-20 w-20 lg:w-24 lg:h-24 flex flex-col transition-all flex-grow-0 flex-nowrap flex-none rounded-xl border border-gray-200 overflow-hidden"
          src={props.appDetails?.icon}
          alt={props.appDetails?.title}
        />
        <div className="mt-1.5 max-w-20 lg:max-w-24">
          <h2 className="text-black text-sm font-semibold line-clamp-1">
            {props.appDetails?.title}
          </h2>
          <p className="text-gray-400 line-clamp-3 text-xs">
            {props.appDetails?.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
