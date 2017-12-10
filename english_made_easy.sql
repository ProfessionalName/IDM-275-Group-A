-- MySQL dump 10.13  Distrib 5.7.20, for osx10.12 (x86_64)
--
-- Host: localhost    Database: english_made_easy
-- ------------------------------------------------------
-- Server version	5.7.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `definitions`
--

DROP TABLE IF EXISTS `definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `definitions` (
  `word` varchar(30) NOT NULL,
  `definition` varchar(140) DEFAULT NULL,
  PRIMARY KEY (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `definitions`
--

LOCK TABLES `definitions` WRITE;
/*!40000 ALTER TABLE `definitions` DISABLE KEYS */;
INSERT INTO `definitions` VALUES ('abstain','choose not to consume'),('adept','someone who is dazzlingly skilled in any field'),('advantage','benefit resulting from some event or action'),('agreement','the statement (oral or written) of an exchange of promises'),('ambiguous','open to two or more interpretations; or of uncertain nature or significance; or (often) intended to mislead'),('amount','how much there is or how many there are of something that you can quantify'),('anarchy','a state of lawlessness and disorder (usually resulting from a failure of government)'),('applause','a demonstration of approval by clapping the hands together'),('asylum','a shelter from danger or hardship'),('bias','a partiality that prevents objective consideration of an issue or situation'),('chronic','habitual'),('coherence','the state of cohering or sticking together'),('collaborate','work together on a common enterprise of project'),('conjunction','the state of being joined together'),('constrain','to close within bounds, or otherwise limit or deprive of free movement'),('decree','decide with authority'),('defunct','having ceased to exist or live'),('efficacy','capacity or power to produce a desired effect'),('eloquent','expressing yourself readily, clearly, effectively'),('embark','proceed somewhere despite the risk of possible dangers'),('employment','the occupation for which you are paid'),('explicit','precisely and clearly expressed or readily observable; leaving nothing to implication'),('fallacy','a misconception resulting from incorrect reasoning'),('harass','annoy continually or chronically'),('hyperbole','extravagant exaggeration'),('implicit','implied though not directly expressed; inherent in the nature of something'),('indigenous','originating where it is found'),('intransigence','the trait of being intransigent; stubbornly refusing to compromise'),('laudatory','full of or giving praise'),('loll','hang loosely or laxly'),('omnipotent','having unlimited power'),('outwit','beat through cleverness and wit'),('pecuniary','relating to or involving money'),('perpetual','uninterrupted in time and indefinitely long continuing'),('phobia','an anxiety disorder characterized by extreme and irrational fear of simple things or social situations'),('pinnacle','the highest level or degree attainable; the highest stage of development'),('pique','a sudden outburst of anger'),('premise','take something as preexisting and given'),('reliant','relying on another for support'),('rupture','separate or cause to separate abruptly'),('sortie','a military action in which besieged troops burst forth from their position'),('spatial','pertaining to or involving or having the nature of space'),('swindler','a person who swindles you by means of deception or fraud'),('trivia','something of small importance'),('violent','characterized by violence or bloodshed'),('wave','signal with the hands or nod'),('whistle','an inexpensive fipple flute'),('xenophobia','a fear of foreigners or strangers');
/*!40000 ALTER TABLE `definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `question` varchar(200) NOT NULL,
  `option1` varchar(50) DEFAULT NULL,
  `option2` varchar(50) DEFAULT NULL,
  `option3` varchar(50) DEFAULT NULL,
  `option4` varchar(50) DEFAULT NULL,
  `answer` varchar(50) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`question`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES ('What is the meaning of \'intend\'?','have in mind as purpose','consider something','trying new thing','Don\'t really know','have in mind as purpose',1),('Which is the synonym of requisite?','regular','bizarre','necessry','obvious','necessary',5);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scoreboard`
--

DROP TABLE IF EXISTS `scoreboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scoreboard` (
  `username` varchar(20) NOT NULL,
  `total_score` int(11) DEFAULT NULL,
  `level1_score` int(11) DEFAULT NULL,
  `level2_socre` int(11) DEFAULT NULL,
  `level3_score` int(11) DEFAULT NULL,
  `level4_score` int(11) DEFAULT NULL,
  `level5_score` int(11) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scoreboard`
--

LOCK TABLES `scoreboard` WRITE;
/*!40000 ALTER TABLE `scoreboard` DISABLE KEYS */;
/*!40000 ALTER TABLE `scoreboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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

-- Dump completed on 2017-12-09 19:57:33
