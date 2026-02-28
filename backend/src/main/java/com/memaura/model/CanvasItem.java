package com.memaura.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "canvas_items") // MongoDB annotation
public class CanvasItem {

    @Id
    private String id; // Changed from Long to String for MongoDB
    
    private String userId; 
    private String content; 
    private String type;    
    
    private double x;
    private double y;
    private double width;
    private double height;

    public CanvasItem() {}

    // Explicit Getters/Setters if not using Lombok
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    // ... repeat for other fields
}