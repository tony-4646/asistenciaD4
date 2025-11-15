-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-11-2025 a las 00:50:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ad_asistencia`
--

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `detallemiembros`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `detallemiembros` (
`idmiembro` int(11)
,`rol` varchar(100)
,`mnombres` varchar(100)
,`mapellidos` varchar(100)
,`mtelefono` varchar(10)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `detalleregistros`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `detalleregistros` (
`idregistro` int(11)
,`rmiembro` varchar(201)
,`rfecha` date
,`ringreso` time
,`rsalida` time
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembros`
--

CREATE TABLE `miembros` (
  `idmiembro` int(11) NOT NULL,
  `idrol` int(11) DEFAULT NULL,
  `mnombres` varchar(100) DEFAULT NULL,
  `mapellidos` varchar(100) DEFAULT NULL,
  `mtelefono` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `miembros`
--

INSERT INTO `miembros` (`idmiembro`, `idrol`, `mnombres`, `mapellidos`, `mtelefono`) VALUES
(2, 2, 'Kevin', 'Meneses', '09392983'),
(10, 6, 'Anthony', 'Meneses', '09392984');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros`
--

CREATE TABLE `registros` (
  `idregistro` int(11) NOT NULL,
  `idmiembro` int(11) DEFAULT NULL,
  `rfecha` date DEFAULT NULL,
  `ringreso` time DEFAULT NULL,
  `rsalida` time DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `registros`
--

INSERT INTO `registros` (`idregistro`, `idmiembro`, `rfecha`, `ringreso`, `rsalida`) VALUES
(6, 2, '2025-11-15', '17:43:05', '17:43:17'),
(7, 2, '2025-11-15', '17:43:20', '17:43:24'),
(8, 10, '2025-11-15', '18:23:57', NULL);

--
-- Disparadores `registros`
--
DELIMITER $$
CREATE TRIGGER `entradaconsistente` BEFORE INSERT ON `registros` FOR EACH ROW BEGIN
    DECLARE abierta_existente INT;
    DECLARE registros_hoy INT;
    DECLARE hoy DATE;

    SET hoy = NEW.rfecha; 
    SELECT COUNT(*)
    INTO abierta_existente
    FROM registros
    WHERE idmiembro = NEW.idmiembro  
      AND rsalida IS NULL;

    IF abierta_existente > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El miembro ya tiene una asistencia activa (sin registro de salida).';
    END IF;

    SELECT COUNT(*)
    INTO registros_hoy
    FROM registros
    WHERE idmiembro = NEW.idmiembro  
      AND rfecha = hoy;

    IF registros_hoy >= 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Se ha alcanzado el límite de 2 asistencias permitidas por día para este miembro.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `entradasduplicadas` BEFORE INSERT ON `registros` FOR EACH ROW BEGIN
    DECLARE existente INT;
    SELECT COUNT(*)
    INTO existente
    FROM registros
    WHERE idmiembro = NEW.idmiembro  
      AND rsalida IS NULL;

    IF existente > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El miembro ya tiene una asistencia sin registro de salida';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `idrol` int(11) NOT NULL,
  `rnombre` varchar(100) DEFAULT NULL,
  `rdescripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`idrol`, `rnombre`, `rdescripcion`) VALUES
(2, 'Aseo', 'un rol de prueba '),
(6, 'Rol 2', 'un rol de prueba ');

-- --------------------------------------------------------

--
-- Estructura para la vista `detallemiembros`
--
DROP TABLE IF EXISTS `detallemiembros`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `detallemiembros`  AS SELECT `m`.`idmiembro` AS `idmiembro`, ifnull(`r`.`rnombre`,'Sin Rol Asignado') AS `rol`, `m`.`mnombres` AS `mnombres`, `m`.`mapellidos` AS `mapellidos`, `m`.`mtelefono` AS `mtelefono` FROM (`miembros` `m` left join `roles` `r` on(`m`.`idrol` = `r`.`idrol`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `detalleregistros`
--
DROP TABLE IF EXISTS `detalleregistros`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `detalleregistros`  AS SELECT `r`.`idregistro` AS `idregistro`, concat(`m`.`mnombres`,' ',`m`.`mapellidos`) AS `rmiembro`, `r`.`rfecha` AS `rfecha`, `r`.`ringreso` AS `ringreso`, `r`.`rsalida` AS `rsalida` FROM (`registros` `r` join `miembros` `m` on(`r`.`idmiembro` = `m`.`idmiembro`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `miembros`
--
ALTER TABLE `miembros`
  ADD PRIMARY KEY (`idmiembro`),
  ADD UNIQUE KEY `mtelefono` (`mtelefono`),
  ADD KEY `idrol` (`idrol`);

--
-- Indices de la tabla `registros`
--
ALTER TABLE `registros`
  ADD PRIMARY KEY (`idregistro`),
  ADD KEY `idmiembro` (`idmiembro`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idrol`),
  ADD UNIQUE KEY `rnombre` (`rnombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `miembros`
--
ALTER TABLE `miembros`
  MODIFY `idmiembro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `registros`
--
ALTER TABLE `registros`
  MODIFY `idregistro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `idrol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `miembros`
--
ALTER TABLE `miembros`
  ADD CONSTRAINT `miembros_ibfk_1` FOREIGN KEY (`idrol`) REFERENCES `roles` (`idrol`);

--
-- Filtros para la tabla `registros`
--
ALTER TABLE `registros`
  ADD CONSTRAINT `registros_ibfk_1` FOREIGN KEY (`idmiembro`) REFERENCES `miembros` (`idmiembro`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
