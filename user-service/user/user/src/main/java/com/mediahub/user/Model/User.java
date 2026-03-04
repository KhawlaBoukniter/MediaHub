package com.mediahub.user.Model;

import javax.management.relation.Role;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
public class User {
    private int Id ;  
    private String username ; 
    private String email ;
    private String password ; 
    private  Role role ;
} 