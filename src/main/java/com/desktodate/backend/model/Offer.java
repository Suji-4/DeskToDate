package com.desktodate.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "offers")
public class Offer {

    @Id
    private String id;

    private String title;
    private String titleAccent;
    private String topLabel;
    private String discount;
    private String badge;
    private String note;
    private String cta;
    private String image;
    private String type;
    private boolean active;

    public Offer() {
    }

    public Offer(
            String title,
            String titleAccent,
            String topLabel,
            String discount,
            String badge,
            String note,
            String cta,
            String image,
            String type,
            boolean active
    ) {
        this.title = title;
        this.titleAccent = titleAccent;
        this.topLabel = topLabel;
        this.discount = discount;
        this.badge = badge;
        this.note = note;
        this.cta = cta;
        this.image = image;
        this.type = type;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleAccent() {
        return titleAccent;
    }

    public void setTitleAccent(String titleAccent) {
        this.titleAccent = titleAccent;
    }

    public String getTopLabel() {
        return topLabel;
    }

    public void setTopLabel(String topLabel) {
        this.topLabel = topLabel;
    }

    public String getDiscount() {
        return discount;
    }

    public void setDiscount(String discount) {
        this.discount = discount;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getCta() {
        return cta;
    }

    public void setCta(String cta) {
        this.cta = cta;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}