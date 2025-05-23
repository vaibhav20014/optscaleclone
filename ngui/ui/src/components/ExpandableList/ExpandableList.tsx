import { ReactNode, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import DashedTypography from "components/DashedTypography";
import { useToggle } from "hooks/useToggle";

type ExpandableListProps<T> = {
  items: T[];
  render: (item: T, index: number, items: T[]) => ReactNode;
  maxRows?: number;
  stopPropagationOnShowMore?: boolean;
};

const Expander = <T,>({ items, render, maxRows = undefined, stopPropagationOnShowMore = false }: ExpandableListProps<T>) => {
  const [isExpanded, setIsExpanded] = useToggle(false);

  const content = useMemo(() => {
    const max = isExpanded ? items.length : maxRows;
    const itemsToShow = items.slice(0, max);
    return itemsToShow.map((item, i, array) => render(item, i, array));
  }, [isExpanded, items, maxRows, render]);

  return (
    <>
      {content}
      <DashedTypography
        onClick={(event) => {
          if (stopPropagationOnShowMore) {
            event.stopPropagation();
          }
          setIsExpanded();
        }}
      >
        <FormattedMessage id={isExpanded ? "showLess" : "showMore"} />
      </DashedTypography>
    </>
  );
};

const ExpandableList = <T,>({
  items,
  render,
  maxRows = undefined,
  stopPropagationOnShowMore = false
}: ExpandableListProps<T>) => {
  if (maxRows && items.length > maxRows) {
    return <Expander items={items} render={render} maxRows={maxRows} stopPropagationOnShowMore={stopPropagationOnShowMore} />;
  }

  return items.map((item, i, array) => render(item, i, array));
};

export default ExpandableList;
