import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  makeStyles,
  Spinner,
  tokens
} from "@fluentui/react-components";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import SearchListItem from "./SearchListItem";
import { searchLostFound, getLostFound, LostFound } from "../../apis/lostfound";
import { searchLostGoods, getLostGoods, LostGoods } from "../../apis/lostgoods";
import useIntersect from "../../hooks/useIntersect";
import useSearchStore from "../../stores/search";

const useStyles = makeStyles({
  root: {
    overflow: "auto"
  },
  tableHeader: {
    backgroundColor: ""
  },
  spinner: {
    margin: "16px",
    "&>span": {
      backgroundColor: tokens.colorPaletteLightGreenBackground2
    }
  }
});

function SearchList() {
  const styles = useStyles();

  const { query, items, prevId, isLostGoods, setItems, setPrevId } =
    useSearchStore();
  const [isEndOfPage, setIsEndOfPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getItems = () => {
    setIsLoading(true);
    const task = query
      ? isLostGoods
        ? searchLostGoods(query, prevId)
        : searchLostFound(query, prevId)
      : isLostGoods
        ? getLostGoods(prevId)
        : getLostFound(prevId);

    task
      .then((data) => {
        const lastId = data.at(-1)?._id;

        if (lastId && lastId !== prevId) {
          setItems(
            isLostGoods
              ? [...(items as LostGoods[]), ...(data as LostGoods[])]
              : [...(items as LostFound[]), ...(data as LostFound[])]
          );
          setPrevId(lastId);
        } else {
          setIsEndOfPage(true);
        }
      })
      .catch((e: AxiosError) => {
        console.error(e);
        setIsEndOfPage(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const scrollRef = useIntersect((entry, observer) => {
    observer.unobserve(entry.target);
    if (!isEndOfPage && !isLoading) {
      getItems();
    }
  });

  useEffect(() => {
    setItems([]);
    setPrevId(undefined);
    setIsEndOfPage(false);
  }, [query, isLostGoods]);

  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>사진</TableHeaderCell>
            <TableHeaderCell>이름</TableHeaderCell>
            <TableHeaderCell>
              {isLostGoods ? "분실 장소" : "보관 장소"}
            </TableHeaderCell>
            <TableHeaderCell>
              {isLostGoods ? "분실 날짜" : "보관 날짜"}
            </TableHeaderCell>
            <TableHeaderCell>분류</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <SearchListItem key={idx} item={item} />
          ))}
        </TableBody>
      </Table>
      <div ref={scrollRef}>
        {isLoading ? (
          <Spinner className={styles.spinner} />
        ) : (
          <div style={{ height: "1px" }} />
        )}
      </div>
    </div>
  );
}

export default SearchList;
