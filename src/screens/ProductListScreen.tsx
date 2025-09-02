import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addToCart, Product } from '../store/cartSlice';

// Mock data for 20 diamond jewellery products
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Classic Solitaire Diamond Ring",
    price: 2500,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Princess Cut Diamond Earrings",
    price: 1800,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Vintage Diamond Necklace",
    price: 3200,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 4,
    title: "Modern Diamond Tennis Bracelet",
    price: 2100,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 5,
    title: "Oval Cut Diamond Pendant",
    price: 1500,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 6,
    title: "Three Stone Diamond Ring",
    price: 2800,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 7,
    title: "Diamond Stud Earrings",
    price: 1200,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 8,
    title: "Art Deco Diamond Brooch",
    price: 4500,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 9,
    title: "Pear Shaped Diamond Ring",
    price: 2200,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 10,
    title: "Diamond Halo Engagement Ring",
    price: 3500,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 11,
    title: "Marquise Cut Diamond Earrings",
    price: 1900,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 12,
    title: "Diamond Infinity Necklace",
    price: 2800,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 13,
    title: "Cushion Cut Diamond Ring",
    price: 2400,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 14,
    title: "Diamond Cross Pendant",
    price: 1600,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 15,
    title: "Emerald Cut Diamond Ring",
    price: 3100,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 16,
    title: "Diamond Heart Pendant",
    price: 1400,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 17,
    title: "Asscher Cut Diamond Ring",
    price: 2600,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 18,
    title: "Diamond Flower Earrings",
    price: 1700,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 19,
    title: "Radiant Cut Diamond Ring",
    price: 2900,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 20,
    title: "Diamond Star Pendant",
    price: 1800,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
];

const ProductListScreen = () => {
  const dispatch = useDispatch();

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    Alert.alert('Success', `${product.title} added to cart!`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Diamond Jewellery Collection</Text>
      <FlatList
        data={mockProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  addButtonText: {
    marginLeft: 5,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ProductListScreen;
