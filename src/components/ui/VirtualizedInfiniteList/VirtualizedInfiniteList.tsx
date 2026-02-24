import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { FixedSizeList as List, type ListOnItemsRenderedProps, } from "react-window";

interface InfiniteScrollContextType<T> {
  items: T[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
}

const InfiniteScrollContext =
  createContext<InfiniteScrollContextType<any> | null>(null);

function useInfiniteScroll<T>() {
  const ctx = useContext(InfiniteScrollContext);
  if (!ctx) {
    throw new Error("InfiniteScroll components must be used inside InfiniteScroll");
  }
  return ctx as InfiniteScrollContextType<T>;
}

interface RootProps<T> {
  items: T[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  children: React.ReactNode;
  initialLoad?: boolean;
}

function InfiniteScrollRoot<T>({
  items,
  hasMore,
  loading,
  loadMore,
  children,
  initialLoad = false,
}: RootProps<T>) {
  const hasCalledInitialLoad = useRef(false);

  useEffect(() => {
    if (initialLoad && !hasCalledInitialLoad.current && items.length === 0 && hasMore) {
      hasCalledInitialLoad.current = true;
      loadMore();
    }
  }, [initialLoad, items.length, hasMore, loadMore]);

  return (
    <InfiniteScrollContext.Provider
      value={{ items, hasMore, loading, loadMore }}
    >
      {children}
    </InfiniteScrollContext.Provider>
  );
}

interface ListProps<T> {
  itemHeight: number;
  children: (item: T, index: number) => React.ReactNode;
}

function InfiniteScrollList<T>({
  itemHeight,
  children,
}: ListProps<T>) {
  const { items, hasMore, loading, loadMore } =
    useInfiniteScroll<T>();

  const isLoadingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(500);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        if (height > 0) {
          setListHeight(height);
        }
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);


  useEffect(() => {
    if (!loading) {
      isLoadingRef.current = false;
    }
  }, [loading]);

  const handleItemsRendered = useCallback(
    ({ overscanStopIndex }: ListOnItemsRenderedProps) => {
      const totalItems = hasMore ? items.length + 1 : items.length;

      if (overscanStopIndex >= totalItems - 3 && hasMore && !loading && !isLoadingRef.current) {
        isLoadingRef.current = true;
        loadMore();
      }
    },
    [items.length, hasMore, loading, loadMore]
  );

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    if (index >= items.length) {
      return (
        <></>
      );
    }

    return (
      <div style={style}>
        {children(items[index], index)}
      </div>
    );
  };

  return (
    <div ref={containerRef} style={{ flex: 1, height: "100%", minHeight: "200px" }}>
      <List
        height={listHeight}
        width="100%"
        itemCount={hasMore ? items.length + 1 : items.length}
        itemSize={itemHeight}
        onItemsRendered={handleItemsRendered}
        style={{ height: "100%" }}
      >
        {Row}
      </List>
    </div>
  );
}

function InfiniteScrollItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}

function InfiniteScrollLoader() {
  const { loading } = useInfiniteScroll<any>();

  if (!loading) return null;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "16px",
      }}
    >
      Loading more...
    </div>
  );
}

export const InfiniteScroll = Object.assign(InfiniteScrollRoot, {
  List: InfiniteScrollList,
  Item: InfiniteScrollItem,
  Loader: InfiniteScrollLoader,
});
