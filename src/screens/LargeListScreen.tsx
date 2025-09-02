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
    <View style={styles.container}>
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

      <View style={styles.performanceInfo}>
        <Text style={styles.performanceTitle}>Performance Optimizations:</Text>
        <Text style={styles.performanceText}>• getItemLayout for fixed height items</Text>
        <Text style={styles.performanceText}>• windowSize optimization</Text>
        <Text style={styles.performanceText}>• Pagination with onEndReached</Text>
        <Text style={styles.performanceText}>• removeClippedSubviews enabled</Text>
        <Text style={styles.performanceText}>• Optimized renderItem with useCallback</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    height: ITEM_HEIGHT,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  performanceInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
});

export default LargeListScreen;
