package com.desktodate.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.desktodate.backend.model.Offer;
import com.desktodate.backend.repository.OfferRepository;

@Service
public class OfferService {

    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public List<Offer> getActiveOffers() {
        return offerRepository.findByActiveTrue();
    }

    public List<Offer> getActiveOffersByType(String type) {
        return offerRepository.findByTypeAndActiveTrue(type);
    }

    public Offer getOfferById(String id) {
        return offerRepository.findById(id).orElse(null);
    }

    public Offer saveOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    public void deleteOffer(String id) {
        offerRepository.deleteById(id);
    }
}