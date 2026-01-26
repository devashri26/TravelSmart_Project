package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.RecentSearch;
import com.BookingSystem.TravelSmartBackend.repository.RecentSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecentSearchService {
    
    private final RecentSearchRepository recentSearchRepository;
    
    public RecentSearchService(RecentSearchRepository recentSearchRepository) {
        this.recentSearchRepository = recentSearchRepository;
    }
    
    public void saveSearch(RecentSearch search) {
        recentSearchRepository.save(search);
    }
    
    public List<RecentSearch> getRecentSearches(Long userId) {
        return recentSearchRepository.findTop10ByUserIdOrderBySearchedAtDesc(userId);
    }
}
