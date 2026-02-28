package com.memaura.repository;

import com.memaura.model.CanvasItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanvasRepository extends MongoRepository<CanvasItem, String> {
    // Find all items belonging to a specific user email
    List<CanvasItem> findByUserId(String userId);
}