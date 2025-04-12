import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Star } from 'react-native-feather';

interface MovieCardProps {
  item: {
    id: string;
    title: string;
    year: string;
    poster_path: string | null;
    rating?: number;
    status: string;
    type: 'movie' | 'series';
  };
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onEdit, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.posterContainer}>
      {item.poster_path ? (
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noPoster}>
          <Icon name="film" size={40} color="#555" />
        </View>
      )}
      <View style={styles.badge}>
        <Text style={[
          styles.badgeText, 
          item.type === 'movie' ? styles.movieBadge : styles.seriesBadge
        ]}>
          {item.type === 'movie' ? 'Filme' : 'Série'}
        </Text>
      </View>
    </View>
    
    <View style={styles.cardContent}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.year}>{item.year}</Text>
        
        {item.rating ? (
          <View style={styles.rating}>
            <Star width={12} height={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}/5</Text>
          </View>
        ) : (
          <Text style={styles.noRating}>Não avaliado</Text>
        )}
      </View>
      
      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.type === "movie"
              ? item.status === "watched"
                ? "Assistido"
                : item.status === "watching"
                ? "Assistindo"
                : "Para assistir"
              : item.status === "completed"
              ? "Assistido"
              : item.status === "watching"
              ? "Assistindo"
              : "Para assistir"}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onEdit(item)}
          >
            <Icon name="edit" size={18} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onDelete(item)}
          >
            <Icon name="trash-2" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  posterContainer: {
    position: 'relative',
    aspectRatio: 2/3,
    width: '100%',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  movieBadge: {
    backgroundColor: '#E50914',
    color: 'white',
  },
  seriesBadge: {
    backgroundColor: '#FFD700',
    color: 'black',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  year: {
    color: '#999',
    fontSize: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#DDD',
    fontSize: 12,
    marginLeft: 4,
  },
  noRating: {
    color: '#666',
    fontSize: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    color: '#CCC',
    fontSize: 10,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
});

export default MovieCard;