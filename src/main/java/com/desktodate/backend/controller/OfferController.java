package com.desktodate.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.desktodate.backend.model.Offer;
import com.desktodate.backend.service.OfferService;

@RestController
@RequestMapping("/offers")
public class OfferController {

    private final OfferService offerService;

    private final Path uploadDirectory = Paths.get("uploads");

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    // =========================================================
    // GET ALL OFFERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {

        return ResponseEntity.ok(
                offerService.getAllOffers()
        );
    }

    // =========================================================
    // GET ACTIVE OFFERS
    // =========================================================

    @GetMapping("/active")
    public ResponseEntity<List<Offer>> getActiveOffers() {

        return ResponseEntity.ok(
                offerService.getActiveOffers()
        );
    }

    // =========================================================
    // GET ACTIVE OFFERS BY TYPE
    // =========================================================

    @GetMapping("/active/{type}")
    public ResponseEntity<List<Offer>> getActiveOffersByType(
            @PathVariable String type
    ) {

        return ResponseEntity.ok(
                offerService.getActiveOffersByType(type)
        );
    }

    // =========================================================
    // GET OFFER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOfferById(
            @PathVariable String id
    ) {

        Offer offer = offerService.getOfferById(id);

        if (offer == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(offer);
    }

    // =========================================================
    // CREATE OFFER
    // =========================================================

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> createOffer(

            @RequestPart(
                    value = "title",
                    required = false
            )
            String title,

            @RequestPart(
                    value = "titleAccent",
                    required = false
            )
            String titleAccent,

            @RequestPart(
                    value = "topLabel",
                    required = false
            )
            String topLabel,

            @RequestPart(
                    value = "discount",
                    required = false
            )
            String discount,

            @RequestPart(
                    value = "badge",
                    required = false
            )
            String badge,

            @RequestPart(
                    value = "note",
                    required = false
            )
            String note,

            @RequestPart(
                    value = "cta",
                    required = false
            )
            String cta,

            @RequestPart(
                    value = "type",
                    required = false
            )
            String type,

            @RequestPart(
                    value = "active",
                    required = false
            )
            String active,

            @RequestPart(
                    value = "image",
                    required = true
            )
            MultipartFile image

    ) {

        try {

            String imageUrl = saveImage(image);

            Offer offer = new Offer();

            offer.setTitle(
                    title != null ? title : ""
            );

            offer.setTitleAccent(
                    titleAccent != null
                            ? titleAccent
                            : ""
            );

            offer.setTopLabel(
                    topLabel != null
                            ? topLabel
                            : ""
            );

            offer.setDiscount(
                    discount != null
                            ? discount
                            : ""
            );

            offer.setBadge(
                    badge != null
                            ? badge
                            : ""
            );

            offer.setNote(
                    note != null
                            ? note
                            : ""
            );

            offer.setCta(
                    cta != null
                            ? cta
                            : ""
            );

            offer.setType(
                    type != null
                            ? type
                            : ""
            );

            offer.setActive(
                    active != null
                            && Boolean.parseBoolean(active)
            );

            offer.setImage(imageUrl);

            Offer savedOffer =
                    offerService.saveOffer(offer);

            return ResponseEntity.ok(savedOffer);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error creating offer: "
                                    + e.getMessage()
                    );
        }
    }

    // =========================================================
    // UPDATE OFFER
    // =========================================================

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateOffer(

            @PathVariable String id,

            @RequestPart(
                    value = "title",
                    required = false
            )
            String title,

            @RequestPart(
                    value = "titleAccent",
                    required = false
            )
            String titleAccent,

            @RequestPart(
                    value = "topLabel",
                    required = false
            )
            String topLabel,

            @RequestPart(
                    value = "discount",
                    required = false
            )
            String discount,

            @RequestPart(
                    value = "badge",
                    required = false
            )
            String badge,

            @RequestPart(
                    value = "note",
                    required = false
            )
            String note,

            @RequestPart(
                    value = "cta",
                    required = false
            )
            String cta,

            @RequestPart(
                    value = "type",
                    required = false
            )
            String type,

            @RequestPart(
                    value = "active",
                    required = false
            )
            String active,

            @RequestPart(
                    value = "image",
                    required = false
            )
            MultipartFile image

    ) {

        try {

            Offer existingOffer =
                    offerService.getOfferById(id);

            if (existingOffer == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            if (title != null) {
                existingOffer.setTitle(title);
            }

            if (titleAccent != null) {
                existingOffer.setTitleAccent(
                        titleAccent
                );
            }

            if (topLabel != null) {
                existingOffer.setTopLabel(
                        topLabel
                );
            }

            if (discount != null) {
                existingOffer.setDiscount(
                        discount
                );
            }

            if (badge != null) {
                existingOffer.setBadge(
                        badge
                );
            }

            if (note != null) {
                existingOffer.setNote(note);
            }

            if (cta != null) {
                existingOffer.setCta(cta);
            }

            if (type != null) {
                existingOffer.setType(type);
            }

            if (active != null) {
                existingOffer.setActive(
                        Boolean.parseBoolean(active)
                );
            }

            if (image != null && !image.isEmpty()) {

                String imageUrl =
                        saveImage(image);

                existingOffer.setImage(imageUrl);
            }

            Offer updatedOffer =
                    offerService.saveOffer(
                            existingOffer
                    );

            return ResponseEntity.ok(
                    updatedOffer
            );

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error updating offer: "
                                    + e.getMessage()
                    );
        }
    }

    // =========================================================
    // DELETE OFFER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffer(
            @PathVariable String id
    ) {

        Offer existingOffer =
                offerService.getOfferById(id);

        if (existingOffer == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        offerService.deleteOffer(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    // =========================================================
    // SAVE IMAGE
    // =========================================================

    private String saveImage(
            MultipartFile image
    ) throws IOException {

        if (image == null || image.isEmpty()) {

            throw new IOException(
                    "Image file is required"
            );
        }

        Files.createDirectories(
                uploadDirectory
        );

        String originalFileName =
                image.getOriginalFilename();

        String extension = "";

        if (
                originalFileName != null
                        && originalFileName.contains(".")
        ) {

            extension =
                    originalFileName.substring(
                            originalFileName.lastIndexOf(".")
                    );
        }

        String fileName =
                UUID.randomUUID()
                        + extension;

        Path filePath =
                uploadDirectory.resolve(
                        fileName
                );

        Files.copy(
                image.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/" + fileName;
    }
}