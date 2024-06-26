import { Divider, Image, makeStyles, tokens } from "@fluentui/react-components";

import { mainColor } from "../../styles/color";

const useStyle = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  itemTop: {
    display: "flex",
    gap: "16px"
  },
  itemBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    gap: "8px"
  },
  itemName: {
    fontSize: "20px",
    fontWeight: "bold",
    color: tokens.colorNeutralForeground1
  },
  itemDescription: {
    fontSize: "14px",
    fontWeight: "bold",
    color: tokens.colorNeutralForeground4
  },
  itemDetail: {
    marginLeft: "auto",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    color: mainColor
  }
});

interface ItemProps {
  name: string;
  address: string;
  category: string;
}

function Item({ name, address, category }: ItemProps) {
  const styles = useStyle();
  return (
    <div>
      <div className={styles.root}>
        <div className={styles.itemTop}>
          <Image src="/logo192.png" width="192px" />
          <div className={styles.itemBox}>
            <div className={styles.itemName}>{name}</div>
            <div className={styles.itemDescription}>{address}</div>
            <div className={styles.itemDescription}>{category}</div>
          </div>
        </div>
        <div className={styles.itemDetail}>상세보기 {">"}</div>
      </div>
      <Divider />
    </div>
  );
}

export default Item;
