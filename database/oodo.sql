-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: teamtech_oodo
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `module` varchar(100) NOT NULL,
  `action` varchar(150) NOT NULL,
  `entity_name` varchar(100) DEFAULT NULL,
  `entity_id` bigint unsigned DEFAULT NULL,
  `description` text,
  `ip_address` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_activity_user` (`user_id`),
  KEY `idx_activity_module` (`module`),
  KEY `idx_activity_action` (`action`),
  KEY `idx_activity_entity` (`entity_name`,`entity_id`),
  KEY `idx_activity_created` (`created_at`),
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_allocations`
--

DROP TABLE IF EXISTS `asset_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_allocations` (
  `allocation_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `allocated_by` bigint unsigned DEFAULT NULL,
  `expected_return_date` date DEFAULT NULL,
  `actual_return_date` date DEFAULT NULL,
  `status_lookup_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`allocation_id`),
  KEY `idx_allocation_asset` (`asset_id`),
  KEY `idx_allocation_user` (`user_id`),
  KEY `idx_allocation_allocated_by` (`allocated_by`),
  KEY `idx_allocation_status` (`status_lookup_id`),
  KEY `idx_allocation_expected_return` (`expected_return_date`),
  KEY `idx_allocation_created` (`created_at`),
  CONSTRAINT `fk_allocation_allocated_by` FOREIGN KEY (`allocated_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_allocation_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_allocation_status` FOREIGN KEY (`status_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_allocation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_allocations`
--

LOCK TABLES `asset_allocations` WRITE;
/*!40000 ALTER TABLE `asset_allocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_categories`
--

DROP TABLE IF EXISTS `asset_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_categories` (
  `category_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uk_category_name` (`category_name`),
  KEY `idx_category_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_categories`
--

LOCK TABLES `asset_categories` WRITE;
/*!40000 ALTER TABLE `asset_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_documents`
--

DROP TABLE IF EXISTS `asset_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_documents` (
  `document_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `uploaded_by` bigint unsigned DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `idx_document_asset` (`asset_id`),
  KEY `idx_document_user` (`uploaded_by`),
  KEY `idx_document_type` (`file_type`),
  CONSTRAINT `fk_document_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_document_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_documents`
--

LOCK TABLES `asset_documents` WRITE;
/*!40000 ALTER TABLE `asset_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_history`
--

DROP TABLE IF EXISTS `asset_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_history` (
  `history_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `action` varchar(100) NOT NULL,
  `old_value` text,
  `new_value` text,
  `changed_by` bigint unsigned DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `idx_history_asset` (`asset_id`),
  KEY `idx_history_user` (`changed_by`),
  KEY `idx_history_action` (`action`),
  KEY `idx_history_created` (`created_at`),
  CONSTRAINT `fk_history_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_history_user` FOREIGN KEY (`changed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_history`
--

LOCK TABLES `asset_history` WRITE;
/*!40000 ALTER TABLE `asset_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_returns`
--

DROP TABLE IF EXISTS `asset_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_returns` (
  `return_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `allocation_id` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `condition_lookup_id` bigint unsigned NOT NULL,
  `notes` text,
  `returned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`return_id`),
  KEY `idx_return_allocation` (`allocation_id`),
  KEY `idx_return_approved_by` (`approved_by`),
  KEY `idx_return_condition` (`condition_lookup_id`),
  KEY `idx_return_date` (`returned_at`),
  CONSTRAINT `fk_return_allocation` FOREIGN KEY (`allocation_id`) REFERENCES `asset_allocations` (`allocation_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_return_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_return_condition` FOREIGN KEY (`condition_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_returns`
--

LOCK TABLES `asset_returns` WRITE;
/*!40000 ALTER TABLE `asset_returns` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_returns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_transfers`
--

DROP TABLE IF EXISTS `asset_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_transfers` (
  `transfer_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `from_user_id` bigint unsigned NOT NULL,
  `to_user_id` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `status_lookup_id` bigint unsigned NOT NULL,
  `reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transfer_id`),
  KEY `idx_transfer_asset` (`asset_id`),
  KEY `idx_transfer_from_user` (`from_user_id`),
  KEY `idx_transfer_to_user` (`to_user_id`),
  KEY `idx_transfer_approved_by` (`approved_by`),
  KEY `idx_transfer_status` (`status_lookup_id`),
  KEY `idx_transfer_created` (`created_at`),
  CONSTRAINT `fk_transfer_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transfer_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transfer_from_user` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transfer_status` FOREIGN KEY (`status_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transfer_to_user` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_transfers`
--

LOCK TABLES `asset_transfers` WRITE;
/*!40000 ALTER TABLE `asset_transfers` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `asset_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned DEFAULT NULL,
  `location_id` bigint unsigned DEFAULT NULL,
  `status_lookup_id` bigint unsigned NOT NULL,
  `condition_lookup_id` bigint unsigned NOT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `asset_tag` varchar(50) NOT NULL,
  `asset_name` varchar(200) NOT NULL,
  `serial_number` varchar(150) DEFAULT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `acquisition_date` date DEFAULT NULL,
  `acquisition_cost` decimal(12,2) DEFAULT NULL,
  `warranty_expiry` date DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `is_bookable` tinyint(1) DEFAULT '0',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `uk_asset_tag` (`asset_tag`),
  UNIQUE KEY `uk_serial_number` (`serial_number`),
  KEY `idx_asset_category` (`category_id`),
  KEY `idx_asset_department` (`department_id`),
  KEY `idx_asset_location` (`location_id`),
  KEY `idx_asset_status` (`status_lookup_id`),
  KEY `idx_asset_condition` (`condition_lookup_id`),
  KEY `idx_asset_creator` (`created_by`),
  KEY `idx_asset_bookable` (`is_bookable`),
  KEY `idx_asset_name` (`asset_name`),
  KEY `idx_asset_qrcode` (`qr_code`),
  KEY `idx_asset_warranty` (`warranty_expiry`),
  KEY `idx_asset_created` (`created_at`),
  CONSTRAINT `fk_asset_category` FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_condition` FOREIGN KEY (`condition_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_status` FOREIGN KEY (`status_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_assignments`
--

DROP TABLE IF EXISTS `audit_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_assignments` (
  `assignment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `audit_cycle_id` bigint unsigned NOT NULL,
  `auditor_id` bigint unsigned NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  UNIQUE KEY `uk_audit_assignment` (`audit_cycle_id`,`auditor_id`),
  KEY `idx_assignment_cycle` (`audit_cycle_id`),
  KEY `idx_assignment_auditor` (`auditor_id`),
  CONSTRAINT `fk_assignment_auditor` FOREIGN KEY (`auditor_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_assignment_cycle` FOREIGN KEY (`audit_cycle_id`) REFERENCES `audit_cycles` (`audit_cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_assignments`
--

LOCK TABLES `audit_assignments` WRITE;
/*!40000 ALTER TABLE `audit_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_cycles`
--

DROP TABLE IF EXISTS `audit_cycles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_cycles` (
  `audit_cycle_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `department_id` bigint unsigned DEFAULT NULL,
  `location_id` bigint unsigned DEFAULT NULL,
  `status_lookup_id` bigint unsigned NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_by` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_cycle_id`),
  KEY `idx_audit_department` (`department_id`),
  KEY `idx_audit_location` (`location_id`),
  KEY `idx_audit_status` (`status_lookup_id`),
  KEY `idx_audit_creator` (`created_by`),
  KEY `idx_audit_start` (`start_date`),
  KEY `idx_audit_end` (`end_date`),
  CONSTRAINT `fk_audit_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_status` FOREIGN KEY (`status_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_audit_dates` CHECK ((`end_date` >= `start_date`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_cycles`
--

LOCK TABLES `audit_cycles` WRITE;
/*!40000 ALTER TABLE `audit_cycles` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_cycles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_results`
--

DROP TABLE IF EXISTS `audit_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_results` (
  `result_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `audit_cycle_id` bigint unsigned NOT NULL,
  `asset_id` bigint unsigned NOT NULL,
  `verified_by` bigint unsigned NOT NULL,
  `result_lookup_id` bigint unsigned NOT NULL,
  `remarks` text,
  `verified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  UNIQUE KEY `uk_audit_asset` (`audit_cycle_id`,`asset_id`),
  KEY `idx_result_cycle` (`audit_cycle_id`),
  KEY `idx_result_asset` (`asset_id`),
  KEY `idx_result_user` (`verified_by`),
  KEY `idx_result_lookup` (`result_lookup_id`),
  KEY `idx_result_verified` (`verified_at`),
  CONSTRAINT `fk_result_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_result_cycle` FOREIGN KEY (`audit_cycle_id`) REFERENCES `audit_cycles` (`audit_cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_result_lookup` FOREIGN KEY (`result_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_result_user` FOREIGN KEY (`verified_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_results`
--

LOCK TABLES `audit_results` WRITE;
/*!40000 ALTER TABLE `audit_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `department_name` varchar(150) NOT NULL,
  `parent_department_id` bigint unsigned DEFAULT NULL,
  `department_head_id` bigint unsigned DEFAULT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `uk_department_name` (`department_name`),
  KEY `idx_department_parent` (`parent_department_id`),
  KEY `idx_department_head` (`department_head_id`),
  KEY `idx_department_active` (`is_active`),
  CONSTRAINT `fk_department_head` FOREIGN KEY (`department_head_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_department_parent` FOREIGN KEY (`parent_department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `location_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `department_id` bigint unsigned DEFAULT NULL,
  `location_name` varchar(150) NOT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`location_id`),
  KEY `idx_location_department` (`department_id`),
  KEY `idx_location_name` (`location_name`),
  KEY `idx_location_active` (`is_active`),
  CONSTRAINT `fk_location_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lookup_values`
--

DROP TABLE IF EXISTS `lookup_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lookup_values` (
  `lookup_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lookup_type` varchar(50) NOT NULL,
  `lookup_value` varchar(100) NOT NULL,
  `display_order` int DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`lookup_id`),
  UNIQUE KEY `uk_lookup` (`lookup_type`,`lookup_value`),
  KEY `idx_lookup_type` (`lookup_type`),
  KEY `idx_lookup_active` (`is_active`),
  KEY `idx_lookup_display` (`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lookup_values`
--

LOCK TABLES `lookup_values` WRITE;
/*!40000 ALTER TABLE `lookup_values` DISABLE KEYS */;
INSERT INTO `lookup_values` VALUES (1,'ASSET_STATUS','Available',1,1,'2026-07-12 06:45:22'),(2,'ASSET_STATUS','Allocated',2,1,'2026-07-12 06:45:22'),(3,'ASSET_STATUS','Reserved',3,1,'2026-07-12 06:45:22'),(4,'ASSET_STATUS','Under Maintenance',4,1,'2026-07-12 06:45:22'),(5,'ASSET_STATUS','Lost',5,1,'2026-07-12 06:45:22'),(6,'ASSET_STATUS','Retired',6,1,'2026-07-12 06:45:22'),(7,'ASSET_STATUS','Disposed',7,1,'2026-07-12 06:45:22'),(8,'ASSET_CONDITION','Excellent',1,1,'2026-07-12 06:45:22'),(9,'ASSET_CONDITION','Good',2,1,'2026-07-12 06:45:22'),(10,'ASSET_CONDITION','Fair',3,1,'2026-07-12 06:45:22'),(11,'ASSET_CONDITION','Poor',4,1,'2026-07-12 06:45:22'),(12,'ASSET_CONDITION','Damaged',5,1,'2026-07-12 06:45:22'),(13,'ALLOCATION_STATUS','Active',1,1,'2026-07-12 06:45:22'),(14,'ALLOCATION_STATUS','Returned',2,1,'2026-07-12 06:45:22'),(15,'ALLOCATION_STATUS','Overdue',3,1,'2026-07-12 06:45:22'),(16,'TRANSFER_STATUS','Requested',1,1,'2026-07-12 06:45:22'),(17,'TRANSFER_STATUS','Approved',2,1,'2026-07-12 06:45:22'),(18,'TRANSFER_STATUS','Rejected',3,1,'2026-07-12 06:45:22'),(19,'TRANSFER_STATUS','Completed',4,1,'2026-07-12 06:45:22'),(20,'BOOKING_STATUS','Upcoming',1,1,'2026-07-12 06:45:22'),(21,'BOOKING_STATUS','Ongoing',2,1,'2026-07-12 06:45:22'),(22,'BOOKING_STATUS','Completed',3,1,'2026-07-12 06:45:22'),(23,'BOOKING_STATUS','Cancelled',4,1,'2026-07-12 06:45:22'),(24,'MAINTENANCE_STATUS','Pending',1,1,'2026-07-12 06:45:22'),(25,'MAINTENANCE_STATUS','Approved',2,1,'2026-07-12 06:45:22'),(26,'MAINTENANCE_STATUS','Rejected',3,1,'2026-07-12 06:45:22'),(27,'MAINTENANCE_STATUS','Technician Assigned',4,1,'2026-07-12 06:45:22'),(28,'MAINTENANCE_STATUS','In Progress',5,1,'2026-07-12 06:45:22'),(29,'MAINTENANCE_STATUS','Resolved',6,1,'2026-07-12 06:45:22'),(30,'PRIORITY','Low',1,1,'2026-07-12 06:45:22'),(31,'PRIORITY','Medium',2,1,'2026-07-12 06:45:22'),(32,'PRIORITY','High',3,1,'2026-07-12 06:45:22'),(33,'PRIORITY','Critical',4,1,'2026-07-12 06:45:22'),(34,'AUDIT_STATUS','Scheduled',1,1,'2026-07-12 06:45:22'),(35,'AUDIT_STATUS','In Progress',2,1,'2026-07-12 06:45:22'),(36,'AUDIT_STATUS','Completed',3,1,'2026-07-12 06:45:22'),(37,'AUDIT_STATUS','Closed',4,1,'2026-07-12 06:45:22'),(38,'AUDIT_RESULT','Verified',1,1,'2026-07-12 06:45:22'),(39,'AUDIT_RESULT','Missing',2,1,'2026-07-12 06:45:22'),(40,'AUDIT_RESULT','Damaged',3,1,'2026-07-12 06:45:22'),(41,'RESOURCE_TYPE','Meeting Room',1,1,'2026-07-12 06:45:22'),(42,'RESOURCE_TYPE','Conference Hall',2,1,'2026-07-12 06:45:22'),(43,'RESOURCE_TYPE','Vehicle',3,1,'2026-07-12 06:45:22'),(44,'RESOURCE_TYPE','Projector',4,1,'2026-07-12 06:45:22'),(45,'RESOURCE_TYPE','Equipment',5,1,'2026-07-12 06:45:22'),(46,'NOTIFICATION_TYPE','Asset Assigned',1,1,'2026-07-12 06:45:22'),(47,'NOTIFICATION_TYPE','Asset Returned',2,1,'2026-07-12 06:45:22'),(48,'NOTIFICATION_TYPE','Transfer Approved',3,1,'2026-07-12 06:45:22'),(49,'NOTIFICATION_TYPE','Booking Confirmed',4,1,'2026-07-12 06:45:22'),(50,'NOTIFICATION_TYPE','Booking Reminder',5,1,'2026-07-12 06:45:22'),(51,'NOTIFICATION_TYPE','Maintenance Approved',6,1,'2026-07-12 06:45:22'),(52,'NOTIFICATION_TYPE','Maintenance Completed',7,1,'2026-07-12 06:45:22'),(53,'NOTIFICATION_TYPE','Audit Assigned',8,1,'2026-07-12 06:45:22'),(54,'NOTIFICATION_TYPE','Overdue Return',9,1,'2026-07-12 06:45:22');
/*!40000 ALTER TABLE `lookup_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_requests`
--

DROP TABLE IF EXISTS `maintenance_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_requests` (
  `maintenance_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `requested_by` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `priority_lookup_id` bigint unsigned NOT NULL,
  `status_lookup_id` bigint unsigned NOT NULL,
  `issue_description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`maintenance_id`),
  KEY `idx_maintenance_asset` (`asset_id`),
  KEY `idx_maintenance_requested_by` (`requested_by`),
  KEY `idx_maintenance_approved_by` (`approved_by`),
  KEY `idx_maintenance_priority` (`priority_lookup_id`),
  KEY `idx_maintenance_status` (`status_lookup_id`),
  KEY `idx_maintenance_created` (`created_at`),
  CONSTRAINT `fk_maintenance_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_maintenance_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_maintenance_priority` FOREIGN KEY (`priority_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_maintenance_requested_by` FOREIGN KEY (`requested_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_maintenance_status` FOREIGN KEY (`status_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_requests`
--

LOCK TABLES `maintenance_requests` WRITE;
/*!40000 ALTER TABLE `maintenance_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_updates`
--

DROP TABLE IF EXISTS `maintenance_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_updates` (
  `update_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `maintenance_id` bigint unsigned NOT NULL,
  `updated_by` bigint unsigned NOT NULL,
  `status_lookup_id` bigint unsigned NOT NULL,
  `comments` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`update_id`),
  KEY `idx_update_maintenance` (`maintenance_id`),
  KEY `idx_update_user` (`updated_by`),
  KEY `idx_update_status` (`status_lookup_id`),
  KEY `idx_update_time` (`updated_at`),
  CONSTRAINT `fk_update_maintenance` FOREIGN KEY (`maintenance_id`) REFERENCES `maintenance_requests` (`maintenance_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_update_status` FOREIGN KEY (`status_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_update_user` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_updates`
--

LOCK TABLES `maintenance_updates` WRITE;
/*!40000 ALTER TABLE `maintenance_updates` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_notification_user` (`user_id`),
  KEY `idx_notification_read` (`is_read`),
  KEY `idx_notification_created` (`created_at`),
  KEY `idx_notification_user_read` (`user_id`,`is_read`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_bookings`
--

DROP TABLE IF EXISTS `resource_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_bookings` (
  `booking_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `resource_id` bigint unsigned NOT NULL,
  `booked_by` bigint unsigned NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `status_lookup_id` bigint unsigned NOT NULL,
  `purpose` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `idx_booking_resource` (`resource_id`),
  KEY `idx_booking_user` (`booked_by`),
  KEY `idx_booking_status` (`status_lookup_id`),
  KEY `idx_booking_start` (`start_datetime`),
  KEY `idx_booking_end` (`end_datetime`),
  KEY `idx_booking_resource_time` (`resource_id`,`start_datetime`,`end_datetime`),
  KEY `idx_booking_created` (`created_at`),
  CONSTRAINT `fk_booking_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_booking_status` FOREIGN KEY (`status_lookup_id`) REFERENCES `lookup_values` (`lookup_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`booked_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_booking_time` CHECK ((`end_datetime` > `start_datetime`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_bookings`
--

LOCK TABLES `resource_bookings` WRITE;
/*!40000 ALTER TABLE `resource_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `resource_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `resource_name` varchar(200) NOT NULL,
  `booking_type` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resource_id`),
  UNIQUE KEY `uk_resource_asset` (`asset_id`),
  KEY `idx_resource_name` (`resource_name`),
  KEY `idx_resource_type` (`booking_type`),
  KEY `idx_resource_active` (`is_active`),
  KEY `idx_resource_created` (`created_at`),
  CONSTRAINT `fk_resource_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` text,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uk_roles_name` (`role_name`),
  KEY `idx_roles_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','System Administrator',1,'2026-07-12 06:45:22','2026-07-12 06:45:22'),(2,'Employee','Default Employee',1,'2026-07-12 06:45:22','2026-07-12 06:45:22'),(3,'Department Head','Department Manager',1,'2026-07-12 06:45:22','2026-07-12 06:45:22'),(4,'Asset Manager','Asset Management Team',1,'2026-07-12 06:45:22','2026-07-12 06:45:22');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `email_verified` tinyint(1) DEFAULT '0',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role_id`),
  KEY `idx_users_department` (`department_id`),
  KEY `idx_users_name` (`first_name`,`last_name`),
  KEY `idx_users_active` (`is_active`),
  CONSTRAINT `fk_users_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-12 12:16:10
