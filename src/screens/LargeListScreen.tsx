import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ListItem {
  id: number;
  title: string;
  description: string;
  category: string;
}

const ITEM_HEIGHT = 80;
const ITEMS_PER_PAGE = 100;
const TOTAL_ITEMS = 5000;

const LargeListScreen = () => {
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Generate mock data
  const generateMockData = useCallback((page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, TOTAL_ITEMS);
    
    const newItems: ListItem[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      newItems.push({
        id: i + 1,
        title: `Item ${i + 1}`,
        description: `This is a detailed description for item ${i + 1}. It contains some sample text to demonstrate the layout.`,
        category: `Category ${Math.floor(i / 100) + 1}`,
      });
    }
    return newItems;
  }, []);

  // Load initial data
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newData = generateMockData(1);
    setData(newData);
    setCurrentPage(1);
    setLoading(false);
  }, [generateMockData]);

  const loadMoreData = useCallback(async () => {
    if (loading || data.length >= TOTAL_ITEMS) return;
    
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nextPage = currentPage + 1;
    const newData = generateMockData(nextPage);
    setData(prev => [...prev, ...newData]);
    setCurrentPage(nextPage);
    setLoading(false);
  }, [loading, data.length, currentPage, generateMockData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const renderItem = useCallback(({ item }: { item: ListItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemId}>ID: {item.id}</Text>
        <Ionicons name="chevron-forward" size={16} color="#999" />
      </View>
    </View>
  ), []);

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more items...</Text>
      </View>
    );
  }, [loading]);

  const keyExtractor = useCallback((item: ListItem) => item.id.toString(), []);

  const performanceStats = useMemo(() => ({
    totalItems: TOTAL_ITEMS,
    loadedItems: data.length,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  }), [data.length, currentPage]);

  if (data.length === 0 && loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading initial data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Large List (5,000 Items)</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Loaded: {performanceStats.loadedItems}/{performanceStats.totalItems}
          </Text>
          <Text style={styles.statsText}>
            Page: {performanceStats.currentPage}
          </Text>
        </View>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={20}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={true}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />

      {/* <View style={styles.performanceInfo}>
        <Text style={styles.performanceTitle}>Performance Optimizations:</Text>
        <Text style={styles.performanceText}>• getItemLayout for fixed height items</Text>
        <Text style={styles.performanceText}>• windowSize optimization</Text>
        <Text style={styles.performanceText}>• Pagination with onEndReached</Text>
        <Text style={styles.performanceText}>• removeClippedSubviews enabled</Text>
        <Text style={styles.performanceText}>• Optimized renderItem with useCallback</Text>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#111',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    height: ITEM_HEIGHT,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    flex: 1,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemId: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#ccc',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  performanceInfo: {
    backgroundColor: '#111',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 2,
  },
});

export default LargeListScreen;
